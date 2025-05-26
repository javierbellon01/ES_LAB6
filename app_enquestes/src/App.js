import React, { useState } from "react";

const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
  },
  header: {
    textAlign: "center",
    color: "#222",
    marginBottom: 30,
    fontWeight: "700",
    fontSize: "2.5rem",
    letterSpacing: "0.05em"
  },
  section: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
    marginBottom: 30
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    marginBottom: 15,
    borderRadius: 6,
    border: "1.5px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.25s",
  },
  inputFocus: {
    borderColor: "#4f46e5",
    boxShadow: "0 0 5px rgba(79, 70, 229, 0.4)",
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1.5px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    marginLeft: 10,
    cursor: "pointer",
    transition: "border-color 0.25s",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    marginRight: 10,
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#4338ca",
  },
  buttonDanger: {
    backgroundColor: "#ef4444",
    marginLeft: 10,
  },
  questionBox: {
    marginBottom: 25,
    padding: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#fafafa"
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1.5px solid #ddd",
    fontSize: "1rem",
  },
  message: {
    marginTop: 20,
    color: "#22c55e",
    fontWeight: "700",
    textAlign: "center",
    fontSize: "1.1rem",
  },
  responseBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
  },
  resultsTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: 10,
    color: "#333"
  },
  listItem: {
    fontSize: "1rem",
    marginBottom: 6,
  }
};

function App() {
  const [enquestes, setEnquestes] = useState([]);
  const [titol, setTitol] = useState("");
  const [preguntes, setPreguntes] = useState([
    { text: "", tipus: "opcio", opcions: ["", ""] }
  ]);
  const [historial, setHistorial] = useState([]);
  const [missatge, setMissatge] = useState("");
  const [respostesActual, setRespostesActual] = useState({});
  const [mostrarRespostes, setMostrarRespostes] = useState(false);
  const [enquestaActual, setEnquestaActual] = useState(null);

  const guardaHistorial = () => {
    setHistorial((h) => [...h, {
      enquestes: JSON.parse(JSON.stringify(enquestes)),
      titol,
      preguntes: JSON.parse(JSON.stringify(preguntes))
    }]);
  };

  const desfer = () => {
    if (historial.length === 0) {
      setMissatge("No hi ha accions per desfer");
      return;
    }
    const ultim = historial[historial.length - 1];
    setEnquestes(ultim.enquestes);
    setTitol(ultim.titol);
    setPreguntes(ultim.preguntes);
    setHistorial(historial.slice(0, historial.length - 1));
    setMissatge("Acció desfer amb èxit");
  };

  const afegirPregunta = () => {
    guardaHistorial();
    setPreguntes([...preguntes, { text: "", tipus: "opcio", opcions: ["", ""] }]);
    setMissatge("Pregunta afegida");
  };

  const eliminarPregunta = (index) => {
    guardaHistorial();
    setPreguntes(preguntes.filter((_, i) => i !== index));
    setMissatge("Pregunta eliminada");
  };

  const canviarPreguntaText = (index, nouText) => {
    guardaHistorial();
    const novesPreguntes = [...preguntes];
    novesPreguntes[index].text = nouText;
    setPreguntes(novesPreguntes);
    setMissatge("Pregunta modificada");
  };

  const canviarTipus = (index, nouTipus) => {
    guardaHistorial();
    const novesPreguntes = [...preguntes];
    novesPreguntes[index].tipus = nouTipus;
    if (nouTipus === "opcio" && (!novesPreguntes[index].opcions || novesPreguntes[index].opcions.length === 0)) {
      novesPreguntes[index].opcions = ["", ""];
    } else if (nouTipus === "oberta") {
      novesPreguntes[index].opcions = [];
    }
    setPreguntes(novesPreguntes);
    setMissatge("Tipus de pregunta canviat");
  };

  const afegirOpcio = (pIndex) => {
    guardaHistorial();
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions.push("");
    setPreguntes(novesPreguntes);
    setMissatge("Opció afegida");
  };

  const eliminarOpcio = (pIndex, oIndex) => {
    guardaHistorial();
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions = novesPreguntes[pIndex].opcions.filter(
      (_, i) => i !== oIndex
    );
    setPreguntes(novesPreguntes);
    setMissatge("Opció eliminada");
  };

  const canviarOpcio = (pIndex, oIndex, nouText) => {
    guardaHistorial();
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions[oIndex] = nouText;
    setPreguntes(novesPreguntes);
    setMissatge("Opció modificada");
  };

  const guardarEnquesta = () => {
    if (titol.trim() === "") {
      setMissatge("El títol no pot estar buit");
      return;
    }
    for (let i = 0; i < preguntes.length; i++) {
      if (preguntes[i].text.trim() === "") {
        setMissatge(`La pregunta ${i + 1} està buida`);
        return;
      }
      if (preguntes[i].tipus === "opcio") {
        if (!preguntes[i].opcions || preguntes[i].opcions.length < 2) {
          setMissatge(`La pregunta ${i + 1} ha de tenir almenys dues opcions`);
          return;
        }
        for (let j = 0; j < preguntes[i].opcions.length; j++) {
          if (preguntes[i].opcions[j].trim() === "") {
            setMissatge(`L'opció ${j + 1} de la pregunta ${i + 1} està buida`);
            return;
          }
        }
      }
    }
    guardaHistorial();
    setEnquestes([...enquestes, { titol, preguntes, respostes: [] }]);
    setTitol("");
    setPreguntes([{ text: "", tipus: "opcio", opcions: ["", ""] }]);
    setMissatge("Enquesta guardada");
  };

  const iniciarResposta = (index) => {
    setEnquestaActual(index);
    const enq = enquestes[index];
    let respostesInicials = {};
    enq.preguntes.forEach((p, i) => {
      respostesInicials[i] = p.tipus === "opcio" ? "" : "";
    });
    setRespostesActual(respostesInicials);
    setMostrarRespostes(false);
    setMissatge("");
  };

  const canviarResposta = (pIndex, valor) => {
    setRespostesActual({ ...respostesActual, [pIndex]: valor });
  };

  const enviarResposta = () => {
    const enq = enquestes[enquestaActual];
    for (let i = 0; i < enq.preguntes.length; i++) {
      if (!respostesActual[i] || respostesActual[i].trim() === "") {
        setMissatge(`Cal respondre la pregunta ${i + 1}`);
        return;
      }
    }
    guardaHistorial();
    const novesEnquestes = [...enquestes];
    novesEnquestes[enquestaActual].respostes.push({ ...respostesActual });
    setEnquestes(novesEnquestes);
    setMissatge("Resposta enviada anònimament");
    setMostrarRespostes(true);
  };

  const comptarRespostesOpcio = (respostes, pIndex, opcio) => {
    let comptador = 0;
    respostes.forEach((resposta) => {
      if (resposta[pIndex] === opcio) comptador++;
    });
    return comptador;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>App d’Enquestes</h1>

      <section style={styles.section}>
        <h2 style={{ marginBottom: 15, color: "#4b5563" }}>Crear Enquesta</h2>
        <input
          style={styles.input}
          placeholder="Títol de l'enquesta"
          value={titol}
          onChange={e => setTitol(e.target.value)}
        />
        {preguntes.map((preg, i) => (
          <div key={i} style={styles.questionBox}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <input
                style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                placeholder={`Pregunta ${i + 1}`}
                value={preg.text}
                onChange={e => canviarPreguntaText(i, e.target.value)}
              />
              <select
                style={styles.select}
                value={preg.tipus}
                onChange={e => canviarTipus(i, e.target.value)}
              >
                <option value="opcio">Opcions</option>
                <option value="oberta">Resposta oberta</option>
              </select>
              <button
                onClick={() => eliminarPregunta(i)}
                style={{ ...styles.button, ...styles.buttonDanger }}
                title="Eliminar pregunta"
              >
                ✕
              </button>
            </div>

            {preg.tipus === "opcio" && preg.opcions.map((opc, j) => (
              <div key={j} style={styles.optionRow}>
                <input
                  style={styles.optionInput}
                  placeholder={`Opció ${j + 1}`}
                  value={opc}
                  onChange={e => canviarOpcio(i, j, e.target.value)}
                />
                <button
                  onClick={() => eliminarOpcio(i, j)}
                  style={{ ...styles.button, ...styles.buttonDanger, padding: "5px 10px" }}
                  title="Eliminar opció"
                >
                  ✕
                </button>
              </div>
            ))}
            {preg.tipus === "opcio" && (
              <button
                onClick={() => afegirOpcio(i)}
                style={{ ...styles.button, marginTop: 5, backgroundColor: "#6366f1" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#4f46e5"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#6366f1"}
              >
                Afegir opció
              </button>
            )}
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <button
            onClick={afegirPregunta}
            style={{ ...styles.button, backgroundColor: "#3b82f6" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2563eb"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3b82f6"}
          >
            Afegir pregunta
          </button>
          <button
            onClick={guardarEnquesta}
            style={{ ...styles.button, backgroundColor: "#10b981" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#059669"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#10b981"}
          >
            Guardar enquesta
          </button>
          <button
            onClick={desfer}
            style={{ ...styles.button, ...styles.buttonDanger }}
          >
            Desfer
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={{ marginBottom: 15, color: "#4b5563" }}>Enquestes creades</h2>
        {enquestes.length === 0 && <p>No hi ha enquestes creades encara</p>}
        <ul>
          {enquestes.map((enq, i) => (
            <li key={i} style={{ marginBottom: 15 }}>
              <strong>{enq.titol}</strong>{" "}
              <button
                onClick={() => iniciarResposta(i)}
                style={{ ...styles.button, padding: "6px 12px", fontSize: "0.9rem" }}
              >
                Respondre
              </button>
            </li>
          ))}
        </ul>
      </section>

      {enquestaActual !== null && (
        <section style={styles.section}>
          <h2 style={{ color: "#4b5563" }}>
            Respondre: <em>{enquestes[enquestaActual].titol}</em>
          </h2>
          {enquestes[enquestaActual].preguntes.map((p, i) => (
            <div key={i} style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
                {p.text}
              </label>
              {p.tipus === "opcio" ? (
                <select
                  style={styles.select}
                  value={respostesActual[i] || ""}
                  onChange={e => canviarResposta(i, e.target.value)}
                >
                  <option value="">-- Selecciona --</option>
                  {p.opcions.map((opc, idx) => (
                    <option key={idx} value={opc}>
                      {opc}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  style={{ ...styles.input, height: 80, resize: "vertical" }}
                  value={respostesActual[i] || ""}
                  onChange={e => canviarResposta(i, e.target.value)}
                />
              )}
            </div>
          ))}
          <button
            onClick={enviarResposta}
            style={{ ...styles.button, backgroundColor: "#2563eb" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            Enviar resposta
          </button>
          {mostrarRespostes && (
            <div style={{ marginTop: 25 }}>
              <h3 style={styles.resultsTitle}>Resultats acumulats:</h3>
              {enquestes[enquestaActual].preguntes.map((p, i) => (
                <div key={i} style={{ marginBottom: 15 }}>
                  <strong>{p.text}</strong>
                  {p.tipus === "opcio" ? (
                    <ul>
                      {p.opcions.map((opc, idx) => {
                        const count = comptarRespostesOpcio(enquestes[enquestaActual].respostes, i, opc);
                        return (
                          <li key={idx} style={styles.listItem}>
                            {opc}: {count}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul>
                      {enquestes[enquestaActual].respostes.map((r, idx) => (
                        <li key={idx} style={styles.listItem}>
                          - {r[i]}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {missatge && <div style={styles.message}>{missatge}</div>}
    </div>
  );
}

export default App;
