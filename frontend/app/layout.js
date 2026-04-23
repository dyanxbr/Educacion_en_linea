export const metadata = {
  title: "Educación en Línea",
  description: "Plataforma de cursos online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}