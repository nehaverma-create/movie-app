import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getMovieById, updateMovie } from "../api/movieApi";


function MovieDetail() {
  const [isEdit, setisEdit] = useState(false)
  const [title, setTitle] = useState("")
  const { id } = useParams();
  const {
    data: movie = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    networkMode: "always",
    // only fetch when id exists
    enabled: !!id, // pass only boolean  true or false
    staleTime: 1000 * 60 * 5,
    //  retry: 5, // if error occurs then retry  5times before sending error
    //  refetchInterval:5000,  //call api in loop agaib and again within 5 seconds
  });


  useEffect(() => {
    setTitle(movie.title) // update default title to state
  }, [movie.title])


  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMovie(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movie", id],
      });
        queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
      setisEdit(false)
    },

    onError: (error) => {
      console.log(error);
    },
  });
  const handleSave = () => {
    updateMutation.mutate({
      id,
      data: { title }
    });
  };
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  if (!movie) {
    return <h2>Movie not found</h2>;
  }
  console.log(movie.title)
  return (
    <div>
      <h1>{movie?.title}</h1>


      <img
        src={movie?.poster}
        alt={movie?.title}
      />

      <p>Awards: {movie?.awards}</p>
      <p>Rating: {movie?.imdbRating}</p>
      <p>Released: {movie?.released}</p>
      {isEdit && <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />}
      {!isEdit && <button
        onClick={() => setisEdit(true)}>
        Update
      </button>}
      {isEdit && (
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          Save
        </button>
      )}
      <br />
      <Link to="/">Back Home</Link>
    </div>
  );
}

export default MovieDetail;