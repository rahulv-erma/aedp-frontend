import Image from "next/image";

// NOTE: this is an example shared component

export default function Logo() {
  return (
    <Image
      className="relative"
      src="/next.svg"
      alt="Next.js Logo"
      width={180}
      height={37}
      priority
    />
  );
}
