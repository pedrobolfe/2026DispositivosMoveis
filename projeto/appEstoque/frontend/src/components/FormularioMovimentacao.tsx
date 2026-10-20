import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { movimentacaoApi } from '../api/api';
import { Produto, TipoMovimentacao } from '../types';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => Promise<void>;
}

export function FormularioMovimentacao({ produtos, onMovimentacaoCriada }: Props) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao | ''>('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit() {
    const quantidadeNumerica = Number(quantidade.trim());
    const produtoIdNumerico = Number(produtoId);

    if (
      !produtoId ||
      !tipo ||
      !quantidade.trim() ||
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      setErro('Preencha todos os campos com valores válidos.');
      return;
    }

    try {
      await movimentacaoApi.criar({
        produtoId: produtoIdNumerico,
        tipo,
        quantidade: quantidadeNumerica,
      });
      setProdutoId('');
      setTipo('');
      setQuantidade('');
      setErro('');
      await onMovimentacaoCriada();
    } catch (error) {
      const mensagem =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Não foi possível registrar a movimentação. Tente novamente.';
      setErro(mensagem);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Nova Movimentação</Text>
      <View style={styles.seletor}>
        <Picker selectedValue={produtoId} onValueChange={(value) => setProdutoId(String(value))}>
          <Picker.Item label="Selecione um produto" value="" />
          {produtos.map((produto) => (
            <Picker.Item
              key={produto.id}
              label={`${produto.nome} - Estoque atual: ${produto.quantidade}`}
              value={String(produto.id)}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.seletor}>
        <Picker
          selectedValue={tipo}
          onValueChange={(value) => setTipo(value as TipoMovimentacao | '')}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Entrada" value="ENTRADA" />
          <Picker.Item label="Saída" value="SAIDA" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.botaoTexto}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', marginBottom: 8 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  erro: { color: '#b91c1c', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
