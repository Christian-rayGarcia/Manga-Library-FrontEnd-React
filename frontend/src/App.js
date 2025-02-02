import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [mangaLibrary, setMangaLibrary] = useState([]);
  const [formData, setFormData] = useState({
    bookid: null,
    title: "",
    mangaka: "",
    thumbnail: "",
    state: "",
    rating: null,
  });

  const [ratingData, setRatingData] = useState({});
  const [stateData, setStateData] = useState({});

  const fetchManga = async () => {
    try {
      const response = await axios.get("http://localhost:8000/manga");
      setMangaLibrary(response.data);
    } catch (error) {
      console.error("Error fetching manga library:", error);
    }
  };

  useEffect(() => {
    fetchManga();
  }, []);

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRatingChange = (event, title) => {
    const { value } = event.target;
    setRatingData({
      ...ratingData,
      [title]: value,
    });
  };

  const handleStateChange = (event, title) => {
    const { value } = event.target;
    setStateData({
      ...stateData,
      [title]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8000/manga", formData);
      fetchManga();
      setFormData({
        bookid: null,
        title: "",
        mangaka: "",
        thumbnail: "",
        state: "",
        rating: null,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleRatingSubmit = async (event, title) => {
    event.preventDefault();
    try {
      await axios.put("http://localhost:8000/manga/updating_rating", {
        title: title,
        new_rating: ratingData[title],
      });
      fetchManga();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleStateSubmit = async (event, title) => {
    event.preventDefault();
    try {
      await axios.put("http://localhost:8000/manga/updating_state", {
        title: title,
        new_state: stateData[title],
      });
      fetchManga();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleDeleteManga = async (title) => {
    try {
      await axios.delete("http://localhost:8000/manga/delete_manga", {
        data: { title: title }
      });
      // Filter out the deleted manga from the state
      setMangaLibrary(mangaLibrary.filter(manga => manga.title !== title));
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Manga Library
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              required
            />
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="mangaka" className="form-label">
              Mangaka
            </label>
            <input
              type="text"
              className="form-control"
              id="mangaka"
              name="mangaka"
              onChange={handleInputChange}
              value={formData.mangaka}
            />
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="thumbnail" className="form-label">
              Thumbnail URL
            </label>
            <input
              type="text"
              className="form-control"
              id="thumbnail"
              name="thumbnail"
              onChange={handleInputChange}
              value={formData.thumbnail}
            />
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <select
              className="form-select"
              id="state"
              name="state"
              onChange={handleInputChange}
              value={formData.state}
            >
              <option value="">Choose state</option>
              <option value="read">Read</option>
              <option value="reading">Reading</option>
              <option value="wishlist">Wishlist</option>
            </select>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              type="number"
              className="form-control"
              id="rating"
              name="rating"
              onChange={handleInputChange}
              value={formData.rating || ""}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Mangaka</th>
              <th>Thumbnail</th>
              <th>State</th>
              <th>Rating</th>
              <th>Update Rating</th>
              <th>Update State</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {mangaLibrary.map((manga) => (
              <tr key={manga.bookid}>
                <td>{manga.title}</td>
                <td>{manga.mangaka}</td>
                <td>
                  {manga.thumbnail ? (
                    <img src={manga.thumbnail} alt={manga.title} style={{ width: '100px', height: 'auto' }} />
                  ) : (
                    <span>No Thumbnail</span>
                  )}
                </td>
                <td>{manga.state}</td>
                <td>{manga.rating}</td>
                <td>
                  <form onSubmit={(event) => handleRatingSubmit(event, manga.title)}>
                    <input
                      type="number"
                      className="form-control"
                      value={ratingData[manga.title] || ""}
                      onChange={(event) => handleRatingChange(event, manga.title)}
                    />
                    <button type="submit" className="btn btn-secondary mt-2">
                      Update
                    </button>
                  </form>
                </td>
                <td>
                  <form onSubmit={(event) => handleStateSubmit(event, manga.title)}>
                    <select
                      className="form-select"
                      value={stateData[manga.title] || ""}
                      onChange={(event) => handleStateChange(event, manga.title)}
                    >
                      <option value="">Choose state</option>
                      <option value="read">Read</option>
                      <option value="reading">Reading</option>
                      <option value="wishlist">Wishlist</option>
                    </select>
                    <button type="submit" className="btn btn-secondary mt-2">
                      Update
                    </button>
                  </form>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteManga(manga.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
