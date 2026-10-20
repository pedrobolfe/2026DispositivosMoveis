import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Categoria } from '../types';
import { produtoApi } from '../api/api';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => Promise<void>;
}

export function FormularioProduto({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit() {
    const precoNumerico = Number(preco.trim().replace(',', '.'));
    const quantidadeNumerica = Number(quantidade.trim());
    const categoriaIdNumerico = Number(categoriaId);

    if (
      !nome.trim() ||
      !preco.trim() ||
      !quantidade.trim() ||
      !categoriaId ||
      !Number.isFinite(precoNumerico) ||
      precoNumerico < 0 ||
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica < 0
    ) {
      setErro('Preencha todos os campos com valores válidos.');
      return;
    }

    try {
      await produtoApi.criar({
        nome: nome.trim(),
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
        categoriaId: categoriaIdNumerico,
      });
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId('');
      setErro('');
      await onProdutoCriado();
    } catch {
      setErro('Não foi possível cadastrar o produto. Tente novamente.');
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Novo Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (ex.: 8,50)"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade inicial"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      <View style={styles.seletor}>
        <Picker selectedValue={categoriaId} onValueChange={(value) => setCategoriaId(String(value))}>
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((categoria) => (
            <Picker.Item
              key={categoria.id}
              label={categoria.nome}
              value={String(categoria.id)}
            />
          ))}
        </Picker>
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  erro: { color: '#b91c1c', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
