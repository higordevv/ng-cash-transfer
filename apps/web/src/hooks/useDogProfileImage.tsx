import { useQuery } from "react-query";

type DogImageResponse = {
  message: string;
  status: string;
};

const useDogProfileImage = () => {
  const { data: dogImage, isLoading, isError } = useQuery<DogImageResponse, Error>(
    "dogImage",
    async () => {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      return data;
    },
    {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (typeof window !== "undefined" && !isLoading && !isError && dogImage && !localStorage.getItem("dogImage")) {
    localStorage.setItem("dogImage", dogImage.message);
  }

  const userProfileImage = typeof window !== "undefined" ? localStorage.getItem("dogImage") : null;

  return userProfileImage;
};

export default useDogProfileImage;
