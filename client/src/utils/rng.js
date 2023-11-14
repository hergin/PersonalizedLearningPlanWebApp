let lastId = 0;

export function genID() {
    const randInt = Math.random() * 10 ** 15;
    const perfNowInt = (performance.now() % 10 ** 5) * 10 ** 10;
    return (randInt + perfNowInt + lastId++);
}
