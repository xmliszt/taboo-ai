import { FaRobot } from "react-icons/fa";

interface LoadingProps {
  isLoading: boolean;
  message: string;
}
export default function Loading(props: LoadingProps) {
  return props.isLoading ? (
    <div className="fixed w-screen h-screen z-50 bg-black bg-opacity-50 backdrop-blur-lg flex flex-col gap-6 justify-center items-center">
      <FaRobot className="animate-spin text-white text-5xl" />
      <span className="text-5xl">{props.message}</span>
    </div>
  ) : (
    <></>
  );
}
