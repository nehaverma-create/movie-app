import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMovies, createMovie, deleteMovie , updateMovie} from "../api/movieApi";
import { useState } from "react";


function Home() {

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies"], // pass uniqueid ... used for caching and refetching
    queryFn:getMovies,

    // cache for 5 minutes
    staleTime: 1000 * 60 * 1,
  });
  const queryClient = useQueryClient(); // create query client so that after we can invalidate query

  const createMovieMutation = useMutation({// create mutation only
    mutationFn: createMovie,

    onSuccess: () => {
      // Refetch movies list
      queryClient.invalidateQueries({ // access invalidateQueries using query client 
        queryKey: ["movies"],          // invalidation means stale query (outdatd cache data) and reftech new data
      });
    },

    onError: (error) => {
      console.log(error); // consoling the error
    },
  });

  const handleAddMovie = () => {
    createMovieMutation.mutate({   // update mutation with new data  and call api
      title: "Foo title",
      year: "1994",
      rated: "R",
      released: "14-10-1994",
      runtime: "142 min",
      genre: "Drama",
      director: "Foo director",
      writer: "Foo writer",
      actors: "Fooman",
      plot: "A Foo movie",
      language: "English",
      country: "United States",
      awards: "Nominated for 11 oscars",
      poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
      imdbRating: "10",
      imdbId: "None",
      boxOffice: "$1",
    });
  };
 const deleteMutation = useMutation({// create mutation only
     mutationFn: (id) => deleteMovie(id),
     onSuccess: () => {
      // Refetch movies list
      queryClient.invalidateQueries({ // access invalidateQueries using query client 
        queryKey: ["movies"],          // invalidation means stale query (outdatd cache data) and reftech new data
      });
    },
     onError: (error) => {
      console.log(error); // consoling the error
    },
  });
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  }


    

  

  if (isLoading) {
    return <h2>Loading movies...</h2>;
  }

  if (isError) {
    return <h2>{error?.message}</h2>;
  }


  console.log('****createMovieMutation', createMovieMutation)
 

 
  return (
    <div>
      <h1>Popular Movies</h1>
      <button
        onClick={handleAddMovie}
        disabled={createMovieMutation.isPending}
      >
       Add Movie
      </button>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{ width: "200px" }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: "100%",
                height: "300px",
              }}
            />

            <h4>{movie.title}</h4>

            <Link to={`/movie/${movie.id}`}>
              View Details
            </Link>
            <br/>
           
            <br/>
             <button
              onClick={() => handleDelete(movie.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
              </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
