// =========================
// ===== FRACTIONS =========
// =========================
// 这份文件含有整套关于分数计算与比较的常规函数.



// 求整数 a,b 的最大公约数
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// 将分数 frac 通分
function simplify(frac) {
  if (frac.den < 0) {
    frac.num *= -1;
    frac.den *= -1;
  }
  const g = gcd(frac.num, frac.den);
  return { num: frac.num / g, den: frac.den / g };
}

// 将整数 n 转换成分数格式
function intToFrac(n) {
  return { num: n, den: 1 };
}

// 将分数 f 转换成字符串格式
function fracToString(f) {
  if (f.den === 1) return String(f.num);
  return `${f.num}/${f.den}`;
}

// 计算分数 a,b 的和
function addFrac(a, b) {
  return simplify({
    num: a.num * b.den + b.num * a.den,
    den: a.den * b.den
  });
}

// 计算分数 a,b 的差
function subFrac(a, b) {
  return simplify({
    num: a.num * b.den - b.num * a.den,
    den: a.den * b.den
  });
}

// 计算分数 a,b 的积
function mulFrac(a, b) {
  return simplify({
    num: a.num * b.num,
    den: a.den * b.den
  });
}

// 计算分数 a,b 的商
function divFrac(a, b) {
  return simplify({
    num: a.num * b.den,
    den: a.den * b.num
  });
}

// 判断分数 a,b 是否相等
function equalFrac(a, b) {
  a = simplify(a);
  b = simplify(b);
  return (
    a.num === b.num &&
    a.den === b.den
  );
}