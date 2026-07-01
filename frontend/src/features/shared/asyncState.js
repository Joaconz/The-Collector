// Utilidades compartidas por todos los slices para unificar el manejo de los
// estados asíncronos (loading / success / error) generados por createAsyncThunk.

/** Estado base de una sección asíncrona del store. */
export const createAsyncSection = (data) => ({
  data,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

/**
 * Normaliza el error de un thunk a una forma serializable y homogénea.
 * Se usa con `rejectWithValue` para que slices y componentes siempre lean
 * `{ status, message }`.
 */
export const toRejectedPayload = (err) => ({
  status: err?.status ?? null,
  message: err?.message || 'Ocurrió un error inesperado',
});

/**
 * Registra los tres casos (pending / fulfilled / rejected) de un thunk sobre
 * una sección concreta del estado, evitando repetir la misma lógica en cada
 * slice. `onSuccess(state, action)` aplica el resultado al store.
 */
export const addAsyncCases = (builder, thunk, section, onSuccess) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[section].status = 'loading';
      state[section].error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[section].status = 'succeeded';
      if (onSuccess) onSuccess(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state[section].status = 'failed';
      state[section].error = action.payload || { status: null, message: action.error?.message };
    });
};
