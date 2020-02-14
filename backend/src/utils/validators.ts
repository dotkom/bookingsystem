export const isformidableError = (err: Error) => {
  return (
    err instanceof SyntaxError &&
    String(err.stack).includes('formidable')
  );
};

export const validEmail = (email: string) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};
