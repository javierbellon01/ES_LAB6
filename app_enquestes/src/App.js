import React, { useState } from "react";

function App() {
    const [enquestes, setEnquestes] = useState([]);
    const [titol, setTitol] = useState("");
    const [preguntes, setPreguntes] = useState([
        { text: "", tipus: "opcio", opcions: ["", ""] }
    ]);
    const [historial, setHistorial] = useState([]);
    const [missatge, setMissatge] = useState("");

    // Guarda l'estat actual a l'historial abans de fer canvis
    const guardaHistorial = () => {
        setHistorial((h) => [...h, {
            enquestes: JSON.parse(JSON.stringify(enquestes)),
            titol,
            preguntes: JSON.parse(JSON.stringify(preguntes))
        }]);
    };

    const desfer = () => {
        if (historial.length === 0) return;
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
        guardaHistorial();
        setEnquestes([...enquestes, { titol, preguntes }]);
        setTitol("");
        setPreguntes([{ text: "", tipus: "opcio", opcions: ["", ""] }]);
        setMissatge("Enquesta guardada");
    };

    return (
        <div>
            <h1>Crear Enquesta</h1>
            <input
                placeholder="Títol de l'enquesta"
                value={titol}
                onChange={e => setTitol(e.target.value)}
            />
            {preguntes.map((preg, i) => (
                <div key={i} style={{ marginBottom: 20, border: "1px solid gray", padding: 10 }}>
                    <input
                        placeholder={`Pregunta ${i + 1}`}
                        value={preg.text}
                        onChange={e => canviarPreguntaText(i, e.target.value)}
                    />
                    <select value={preg.tipus} onChange={e => canviarTipus(i, e.target.value)}>
                        <option value="opcio">Opcions</option>
                        <option value="oberta">Resposta oberta</option>
                    </select>
                    <button onClick={() => eliminarPregunta(i)} style={{ marginLeft: 10 }}>
                        Eliminar pregunta
                    </button>

                    {preg.tipus === "opcio" && preg.opcions.map((opc, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center" }}>
                            <input
                                placeholder={`Opció ${j + 1}`}
                                value={opc}
                                onChange={e => canviarOpcio(i, j, e.target.value)}
                            />
                            <button onClick={() => eliminarOpcio(i, j)} style={{ marginLeft: 5 }}>
                                Eliminar opció
                            </button>
                        </div>
                    ))}
                    {preg.tipus === "opcio" && (
                        <button onClick={() => afegirOpcio(i)}>Afegir opció</button>
                    )}
                </div>
            ))}
            <button onClick={afegirPregunta}>Afegir pregunta</button>
            <button onClick={guardarEnquesta}>Guardar enquesta</button>
            <button onClick={desfer}>Desfer última acció</button>

            {missatge && (
                <div style={{ marginTop: 10, color: "green" }}>
                    {missatge}
                </div>
            )}

            <h2>Enquestes guardades</h2>
            {enquestes.map((enq, i) => (
                <div key={i}>
                    <h3>{enq.titol}</h3>
                    {enq.preguntes.map((p, j) => (
                        <p key={j}>
                            {p.text} - {p.tipus === "opcio" ? `Opcions: ${p.opcions.join(", ")}` : "Resposta oberta"}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default App;
