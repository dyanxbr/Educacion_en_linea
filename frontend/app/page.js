"use client";
import { useState, useRef } from "react";

const API = "https://educacionenlinea-production.up.railway.app";

export default function TestImagenCloudinary() {
  const [usuarioId, setUsuarioId] = useState("");
  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const seleccionarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setRespuesta(null);
    setError(null);
  };

  const subirImagen = async () => {
    if (!usuarioId.trim()) return setError("Ingresa el ID del usuario");
    if (!archivo) return setError("Selecciona una imagen primero");

    setCargando(true);
    setError(null);
    setRespuesta(null);

    try {
      const formData = new FormData();
      formData.append("usuario_id", usuarioId.trim());
      formData.append("imagen", archivo);

      const res = await fetch(`${API}/usuarios/imagen`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al subir imagen");

      setRespuesta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.badge}>☁️ Cloudinary</div>
        <h1 style={s.titulo}>Subir Imagen de Perfil</h1>
        <p style={s.subtitulo}>PUT /usuarios/imagen</p>
      </div>

      <div style={s.card}>
        <div style={s.campo}>
          <label style={s.label}>👤 ID del Usuario</label>
          <input
            style={s.input}
            type="number"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          />
        </div>

        <div style={s.campo}>
          <label style={s.label}>🖼️ Imagen</label>
          <div style={s.dropzone} onClick={() => inputRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" style={s.preview} />
            ) : (
              <span>Seleccionar imagen</span>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={seleccionarImagen}
          />
        </div>

        <button onClick={subirImagen} disabled={cargando} style={s.btn}>
          {cargando ? "Subiendo..." : "Subir imagen"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {respuesta && (
          <div>
            <img src={respuesta.imagen_url} style={{ width: "100%" }} />
            <p>{respuesta.imagen_url}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: 20 },
  header: { textAlign: "center" },
  card: { maxWidth: 400, margin: "auto" },
  campo: { marginBottom: 15 },
  input: { width: "100%", padding: 10 },
  dropzone: {
    border: "1px dashed gray",
    padding: 20,
    cursor: "pointer",
  },
  preview: { width: "100%" },
  btn: { width: "100%", padding: 10 },
};