import React, { useState, useEffect } from 'react';

// Usamos React.memo para que la celda no se re-renderice si sus props no cambian
export const CantidadInput = React.memo(({ valorInicial, codigo, onUpdate }: any) => {
    const [localValue, setLocalValue] = useState(valorInicial);

    // Si el valor inicial cambia desde afuera (ej: se limpia el form), actualizamos el local
    useEffect(() => {
        setLocalValue(valorInicial);
    }, [valorInicial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10) || 0;
        setLocalValue(val); // Cambio visual instantáneo
        onUpdate(codigo, val); // Actualiza el estado global
    };

    return (
        <input
            type="number"
            value={localValue}
            onChange={handleChange}
            className="tu-clase-de-estilo"
        />
    );
});
