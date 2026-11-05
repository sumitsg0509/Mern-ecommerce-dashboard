// Escapes user input before using it inside a RegExp (prevents ReDoS / broken search)
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
