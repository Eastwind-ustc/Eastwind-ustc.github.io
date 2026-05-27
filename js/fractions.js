// =========================
// ===== FRACTIONS =========
// =========================

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplify(frac) {
  if (frac.den < 0) {
    frac.num *= -1;
    frac.den *= -1;
  }
  const g = gcd(frac.num, frac.den);
  return { num: frac.num / g, den: frac.den / g };
}

function intToFrac(n) {
  return { num: n, den: 1 };
}

function fracToString(f) {
  if (f.den === 1) return String(f.num);
  return `${f.num}/${f.den}`;
}

function addFrac(a, b) {
  return simplify({
    num: a.num * b.den + b.num * a.den,
    den: a.den * b.den
  });
}

function subFrac(a, b) {
  return simplify({
    num: a.num * b.den - b.num * a.den,
    den: a.den * b.den
  });
}

function mulFrac(a, b) {
  return simplify({
    num: a.num * b.num,
    den: a.den * b.den
  });
}

function divFrac(a, b) {
  return simplify({
    num: a.num * b.den,
    den: a.den * b.num
  });
}

function equalFrac(a, b) {
  a = simplify(a);
  b = simplify(b);

  return (
    a.num === b.num &&
    a.den === b.den
  );
}