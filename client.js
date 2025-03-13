import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const styles = {
  dashboard: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f8f8f8",
  },
  searchInput: {
    marginBottom: "10px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  filterSelect: {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  userItem: {
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  loader: {
    textAlign: "center",
    margin: "20px 0",
  },
};

function UserDashboard({ apiUrl = "https://api.example.com" }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const FILTER_OPTIONS = ["all", "active", "inactive"];
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        filter,
      });

      const response = await axios.get(`${apiUrl}/users?${params}`);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, filter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleFilter = useCallback((event) => {
    setFilter(event.target.value);
    setPage(1);
  }, []);

  const handleUserDelete = useCallback(
    async (id) => {
      if (!id) {
        return;
      }

      try {
        setIsLoading(true);
        await axios.delete(`${apiUrl}/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (err) {
        setError("Failed to delete user. Please try again.");
        console.error("Error deleting user:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.active) ||
      (filter === "inactive" && !user.active);

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={styles.dashboard}>
      <h1>User Dashboard</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
          aria-label="Search users"
        />

        <select
          value={filter}
          onChange={handleFilter}
          style={styles.filterSelect}
          aria-label="Filter users"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {isLoading && (
        <div style={styles.loader} aria-live="polite">
          Loading...
        </div>
      )}

      {!isLoading && filteredUsers.length === 0 && <div>No users found</div>}

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} style={styles.userItem}>
            <div>
              {user.name} - {user.email}
            </div>
            <button
              onClick={() => handleUserDelete(user.id)}
              style={styles.deleteButton}
              aria-label={`Delete ${user.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredUsers.length > 0 && (
        <div>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={filteredUsers.length < ITEMS_PER_PAGE}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

UserDashboard.propTypes = {
  apiUrl: PropTypes.string,
};

export default UserDashboard;
