export const isformidableError = (err: Error) => {
  return (
    err instanceof SyntaxError &&
    String(err.stack).includes('formidable')
  );
};
