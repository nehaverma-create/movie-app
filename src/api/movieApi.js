export const getMovies = async () => {
   const response = await fetch("http://localhost:3000/movies");
  const data = await response.json();
  return data;
};

export const getMovieById = async (id) => {
  const response = await fetch(`http://localhost:3000/movies/${id}`);
  const data = await response.json();
  return data;
};
// api/movieApi.js

export const createMovie = async (movieData) => {
  const response = await fetch("http://localhost:3000/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    throw new Error("Failed to create movie");
  }

  return response.json();
};
export async function deleteMovie(id) {
  const response = await fetch(
    `http://localhost:3000/movies/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }

  return true;
}
export async function updateMovie(id, updatedData) {
  const response = await fetch(
    `http://localhost:3000/movies/${id}`,
    {
      method: "PATCH", // or PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update movie");
  }

  return response.json();
}