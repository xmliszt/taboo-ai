"use client";

import { FiPower } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
}

export default function BackButton(props: BackButtonProps = {}) {
  const router = useRouter();

  const back = () => {
    if (props.href !== undefined) {
      router.push(props.href);
    } else {
      router.back();
    }
  };

  return (
    <button
      id="back"
      className="fixed transition-opacity z-10 top-5 left-4 lg:text-2xl hover:opacity-50 hover:cursor-pointer"
      onClick={() => {
        back();
      }}
    >
      <FiPower />
    </button>
  );
}
