let _root;
try {
  _root = window;
} catch (err) {
  _root = global;
}

export default _root;
