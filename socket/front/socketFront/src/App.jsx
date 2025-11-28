import { useEffect, useState } from "react";

function App() {
  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState(0);
  const [cantidad, setCantidad] = useState("");
  const [cantidadEntrada, setCantidadEntrada] = useState("");
  const [historial, setHistorial] = useState([]);
  const [totales, setTotales] = useState({
    totalEntradas: 0,
    totalSalidas: 0,
    diferencia: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productoRes, historialRes] = await Promise.all([
          fetch("http://localhost:3000/productos"),
          fetch("http://localhost:3000/productos/historial")
        ]);
        
        if (!productoRes.ok) throw new Error("Error al cargar el producto");
        if (!historialRes.ok) throw new Error("Error al cargar el historial");
        
        const productoData = await productoRes.json();
        const historialData = await historialRes.json();

        setProducto(productoData);
        setStock(productoData.stock);

        setHistorial(historialData.historial || []);

        setTotales({
          totalEntradas: historialData.totalEntradas,
          totalSalidas: historialData.totalSalidas,
          diferencia: historialData.diferencia,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => console.log("Conectado al WebSocket");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.stock !== undefined) {
          setStock(msg.stock);
        }

        if (msg.historial) {
          setHistorial(msg.historial.historial || []);

          setTotales({
            totalEntradas: msg.historial.totalEntradas,
            totalSalidas: msg.historial.totalSalidas,
            diferencia: msg.historial.diferencia,
          });
        }

      } catch (err) {
        console.error("Error procesando WS:", err);
      }
    };

    fetchData();
    return () => ws.close();
  }, []);

  const registrarSalida = async () => {
    const qty = Number(cantidad);
    if (isNaN(qty) || qty <= 0) return setError("Cantidad inválida");

    try {
      const res = await fetch("http://localhost:3000/productos/salida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: qty }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setCantidad("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const registrarEntrada = async () => {
    const qty = Number(cantidadEntrada);
    if (isNaN(qty) || qty <= 0) return setError("Cantidad inválida");

    try {
      const res = await fetch("http://localhost:3000/productos/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: qty }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setCantidadEntrada("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="card">
          <h2>Cargando datos del producto...</h2>
        </div>
      </div>
    );
  }

  const stockPercentage = producto && producto.stock_maximo 
    ? (stock / producto.stock_maximo) * 100 
    : 0;

  return (
    <div className="app-container">
      <div className="dashboard-header">
        <h1>Panel de Control de Inventario</h1>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="dashboard-grid">
        <div className="card product-card">
          <h2 className="card-title">Resumen del Producto</h2>

          <div className="product-info">
            <h3 className="product-name">{producto.nombre}</h3>
            <p className="product-code">Código: {producto.codigo}</p>

            <div className="stock-indicator">
              <div className="stock-header">
                <span>Nivel de Stock</span>
                <span className="stock-value">{stock} unidades</span>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min(100, stockPercentage)}%` }}
                ></div>
              </div>
            </div>

            <div className="stock-status">
              {stock === 0 ? (
                <span className="status-badge critical">Sin Stock</span>
              ) : stock < producto.stock_minimo ? (
                <span className="status-badge warning">Stock Bajo</span>
              ) : (
                <span className="status-badge success">En Stock</span>
              )}
            </div>
          </div>
        </div>
        <div className="card movements-card">
          <h2 className="card-title">Historial Completo</h2>

          <p>Total Entradas: {totales.totalEntradas}</p>
          <p>Total Salidas: {totales.totalSalidas}</p>
          <p>Diferencia: {totales.diferencia}</p>

          <div className="movements-list">
            {historial.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {historial.map((mov) => (
                    <tr key={mov.id}>
                      <td className={mov.tipo.toLowerCase()}>
                        {mov.tipo}
                      </td>
                      <td>{mov.cantidad}</td>
                      <td>{mov.fecha} {mov.hora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay movimientos registrados</p>
            )}
          </div>
        </div>
        <div className="card form-card">
          <div className="form-tabs">
            <div className="tab active">Entrada</div>
            <div className="tab">Salida</div>
          </div>
          
          <div className="form-content">
            <div className="form-group">
              <label>Cantidad de Entrada</label>
              <input
                type="number"
                className="input"
                value={cantidadEntrada}
                onChange={(e) => setCantidadEntrada(e.target.value)}
              />
              <button className="btn btn-primary" onClick={registrarEntrada}>
                Registrar Entrada
              </button>
            </div>
            <div className="form-group">
              <label>Cantidad de Salida</label>
              <input
                type="number"
                className="input"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={registrarSalida}>
                Registrar Salida
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
