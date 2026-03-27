import Link from "next/link";

export default function NotFound() {
  return (
     <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2 md:mb-8 ">
          <h1 className="text-2xl md:text-4xl font-bold text-red-400">¡Ups!</h1>
        </div>
          <p className="text-sm text-neutral-600">La página solicitada no existe.</p>
          <Link href="/" className="hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
  );
}
