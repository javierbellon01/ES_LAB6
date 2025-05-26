import React, { useState } from "react";

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

  // Guarda l'estat actual a l'historial abans de fer canvis
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

  // Funcions per respondre
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
    // Validar que totes les preguntes estan respostes
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
    <div style={{ maxWidth: 900, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>App d’Enquestes</h1>

      <section style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
        <h2>Crear Enquesta</h2>
        <input
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="Títol de l'enquesta"
          value={titol}
          onChange={e => setTitol(e.target.value)}
        />
        {preguntes.map((preg, i) => (
          <div key={i} style={{ marginBottom: 20, border: "1px solid gray", padding: 10 }}>
            <input
              style={{ width: "70%", padding: 5 }}
              placeholder={`Pregunta ${i + 1}`}
              value={preg.text}
              onChange={e => canviarPreguntaText(i, e.target.value)}
            />
            <select
              style={{ marginLeft: 10, padding: 5 }}
              value={preg.tipus}
              onChange={e => canviarTipus(i, e.target.value)}
            >
              <option value="opcio">Opcions</option>
              <option value="oberta">Resposta oberta</option>
            </select>
            <button
              onClick={() => eliminarPregunta(i)}
              style={{ marginLeft: 10, backgroundColor: "#f44336", color: "white", border: "none", padding: "5px 10px" }}
            >
              Eliminar pregunta
            </button>

            {preg.tipus === "opcio" && preg.opcions.map((opc, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                <input
                  style={{ flex: 1, padding: 5 }}
                  placeholder={`Opció ${j + 1}`}
                  value={opc}
                  onChange={e => canviarOpcio(i, j, e.target.value)}
                />
                <button
                  onClick={() => eliminarOpcio(i, j)}
                  style={{ marginLeft: 5, backgroundColor: "#f44336", color: "white", border: "none", padding: "5px" }}
                >
                  Eliminar opció
                </button>
              </div>
            ))}
            {preg.tipus === "opcio" && (
              <button onClick={() => afegirOpcio(i)} style={{ marginTop: 5 }}>
                Afegir opció
              </button>
            )}
          </div>
        ))}
        <button onClick={afegirPregunta} style={{ marginRight: 10 }}>
          Afegir pregunta
        </button>
        <button onClick={guardarEnquesta}>Guardar enquesta</button>
        <button onClick={desfer} style={{ marginLeft: 10 }}>
          Desfer última acció
        </button>
      </section>

      <section style={{ border: "1px solid #ccc", padding: 20 }}>
        <h2>Enquestes disponibles</h2>
        {enquestes.length === 0 && <p>No hi ha enquestes disponibles</p>}
        {enquestes.map((enq, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
            <h3>{enq.titol}</h3>
            <button onClick={() => iniciarResposta(i)}>Respondre enquesta</button>
          </div>
        ))}

        {enquestaActual !== null && !mostrarRespostes && (
          <div style={{ border: "1px solid blue", padding: 10, marginTop: 10 }}>
            <h3>Respondre: {enquestes[enquestaActual].titol}</h3>
            {enquestes[enquestaActual].preguntes.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <p>{p.text}</p>
                {p.tipus === "opcio" ? (
                  <select
                    value={respostesActual[i] || ""}
                    onChange={(e) => canviarResposta(i, e.target.value)}
                  >
                    <option value="">Selecciona una opció</option>
                    {p.opcions.map((op, idx) => (
                      <option key={idx} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={respostesActual[i] || ""}
                    onChange={(e) => canviarResposta(i, e.target.value)}
                    placeholder="Resposta oberta"
                  />
                )}
              </div>
            ))}
            <button onClick={enviarResposta}>Enviar resposta</button>
          </div>
        )}

        {mostrarRespostes && (
          <div style={{ marginTop: 20 }}>
            <h3>Resultats de l'enquesta: {enquestes[enquestaActual].titol}</h3>
            {enquestes[enquestaActual].preguntes.map((p, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <strong>{p.text}</strong>
                {p.tipus === "opcio" ? (
                  <ul>
                    {p.opcions.map((op, idx) => (
                      <li key={idx}>
                        {op}:{" "}
                        {enquestes[enquestaActual].respostes
                          ? comptarRespostesOpcio(enquestes[enquestaActual].respostes, i, op)
                          : 0}{" "}
                        vots
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <p>Respostes obertes:</p>
                    <ul>
                      {enquestes[enquestaActual].respostes &&
                        enquestes[enquestaActual].respostes.map((resposta, idx) => (
                          <li key={idx}>{resposta[i]}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setMostrarRespostes(false)}>Tancar resultats</button>
          </div>
        )}
      </section>

      {missatge && (
        <div style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
          {missatge}
        </div>
      )}
    </div>
  );
}

export default App;
