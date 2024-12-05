export default function status(request, response) {
  response.status(200).json({ chave: "O Enzo é uma pessoa acima da média!" });
}
