export default function willReceive(value: number) {
  value = Number(value) || 1000;
  return (value * (100 - 3.99)) / 100;
}
