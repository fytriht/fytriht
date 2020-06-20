const className = (...cxs: (string | null | undefined | false)[]) => {
  return cxs.filter(cx => typeof cx === 'string').join(' ');
};

export default className;
