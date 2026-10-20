import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { movimentacaoApi, produtoApi } from '../api/api';
import { BotaoSair } from '../components/BotaoSair';
import { FormularioMovimentacao } from '../components/FormularioMovimentacao';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { Movimentacao, Produto } from '../types';

export function MovimentacoesScreen() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    try {
      const [movimentacoesCarregadas, produtosCarregados] = await Promise.all([
        movimentacaoApi.listar(),
        produtoApi.listar(),
      ]);
      setMovimentacoes(movimentacoesCarregadas);
      setProdutos(produtosCarregados);
      setErro('');
    } catch {
      setErro('Não foi possível carregar as movimentações e os produtos.');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Movimentações</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <View>
        <ListaMovimentacoes movimentacoes={movimentacoes} />
        <FormularioMovimentacao produtos={produtos} onMovimentacaoCriada={carregar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  erro: { color: '#b91c1c', marginBottom: 12 },
});
