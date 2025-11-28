import { useEffect, useState } from "react";

function App() {
  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [cantidadEntrada, setCantidadEntrada] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
        setStock(data.stock);
      })
      .catch((err) => console.error(err));

    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => console.log("Conectado al WebSocket");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.stock !== undefined) {
        setStock(msg.stock);
      }
    };

    return () => ws.close();
  }, []);

  const registrarSalida = async () => {
    const qty = Number(cantidad);
    if (isNaN(qty) || qty <= 0) return alert("Cantidad inválida");

    try {
      const res = await fetch("http://localhost:3000/productos/salida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: qty }),
      });

      await res.json();
      setCantidad("");
    } catch (err) {
      console.error(err);
    }
  };



  const registrarEntrada = async () => {
    const qty = Number(cantidadEntrada);
    if (isNaN(qty) || qty <= 0) return alert("Cantidad inválida");

    try {
      const res = await fetch("http://localhost:3000/productos/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: qty }),
      });

      await res.json();
      setCantidadEntrada("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="product-name">
          {producto ? producto.nombre : "Cargando..."}
        </h2>

        <p>Código: {producto ? producto.codigo : "..."}</p>

        <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
          Stock actual: <strong>{stock !== null ? stock : "..."}</strong>
        </p>
      </div>

      <div className="card card-form">
        <h1 className="card-title">Registrar salida</h1>

        <input
          type="number"
          placeholder="Cantidad de salida"
          className="input"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button className="btn" onClick={registrarSalida}>
          Registrar salida
        </button>
      </div>

      <div className="card card-form">
        <h1 className="card-title">Registrar Entrada</h1>

        <input
          type="number"
          placeholder="Cantidad de entrada"
          className="input"
          value={cantidadEntrada}
          onChange={(e) => setCantidadEntrada(e.target.value)}
        />

        <button className="btn" onClick={registrarEntrada}>
          Registrar entrada
        </button>
      </div>
    </div>
  );
}

export default App;
