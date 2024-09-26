import NaoEncontrado from "../errors/NaoEncontrado.js";
import { livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (error) {
      next(error);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultados !== null) {
        res.status(200).send(livroResultados);
      } else {
        next(new NaoEncontrado("ID do livro não localizado."));
      }
    } catch (error) {
      next(error);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (error) {
      next(error);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, { $set: req.body });

      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("ID do livro não localizado."));
      }
    } catch (error) {
      next(error);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro removido com sucesso" });
      } else {
        next(new NaoEncontrado("ID do livro não localizado."));
      }
    } catch (error) {
      next(error);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = processaBusca(req.query);

      const livrosResultado = await livros.find(busca);

      res.status(200).send(livrosResultado);
    } catch (error) {
      next(error);
    }
  };

}

function processaBusca(params) {
  const { editora, titulo, minPag, maxPag } = params;

  const busca = {};

  if (editora) busca.editora = { $regex: editora, $options: "i" };
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPag || maxPag) busca.numeroPaginas = {};

  if (minPag) busca.numeroPaginas.$gte = minPag; // >=
  if (maxPag) busca.numeroPaginas.$lte = maxPag;  // <=

  return busca;
}

export default LivroController;