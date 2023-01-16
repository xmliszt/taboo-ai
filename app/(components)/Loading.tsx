import { FaRobot } from "react-icons/fa";

interface LoadingProps {
  isLoading: boolean;
  message: string;
}
export default function LoadingMask(props: LoadingProps) {
  return props.isLoading ? (
    <div className="fixed w-screen h-screen z-50 bg-black bg-opacity-50 backdrop-blur-lg flex flex-col gap-6 justify-center items-center">
      <FaRobot className="animate-spin text-white text-5xl" />
      <span className="text-lg lg:text-3xl text-center">{props.message}</span>
    </div>
  ) : (
    <></>
  );
}
