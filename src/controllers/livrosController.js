import NaoEncontrado from "../errors/NaoEncontrado.js";
import { autores, livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const buscaLivros = livros.find();

      req.resultado = buscaLivros;

      next();
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
      const busca = await processaBusca(req.query);

      if (busca !== null) {

        const livrosResultado = livros
          .find(busca)
          .populate("autor");

        req.resultado = livrosResultado;

        next();
      } else {
        res.status(200).send([]);
      }

    } catch (error) {
      next(error);
    }
  };

}

async function processaBusca(params) {
  const { editora, titulo, minPag, maxPag, nomeAutor } = params;

  let busca = {};

  if (editora) busca.editora = { $regex: editora, $options: "i" };
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPag || maxPag) busca.numeroPaginas = {};

  if (minPag) busca.numeroPaginas.$gte = minPag; // >=
  if (maxPag) busca.numeroPaginas.$lte = maxPag;  // <=

  if (nomeAutor) {
    const autor = await autores.find({ nome: { $regex: nomeAutor, $options: "i" } });

    if (autor !== null) {
      busca.autor = autor.map((obj) => obj._id.toString());
    } else {
      busca = null;
    }
  }

  return busca;
}

export default LivroController;