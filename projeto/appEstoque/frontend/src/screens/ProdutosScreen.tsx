import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BotaoSair } from '../components/BotaoSair';
import { FormularioProduto } from '../components/FormularioProduto';
import { ListaProdutos } from '../components/ListaProdutos';
import { categoriaApi, produtoApi } from '../api/api';
import { Categoria, Produto } from '../types';

export function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    try {
      const [produtosCarregados, categoriasCarregadas] = await Promise.all([
        produtoApi.listar(),
        categoriaApi.listar(),
      ]);
      setProdutos(produtosCarregados);
      setCategorias(categoriasCarregadas);
      setErro('');
    } catch {
      setErro('Não foi possível carregar os produtos e as categorias.');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Produtos</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <View>
        <ListaProdutos produtos={produtos} />
        <FormularioProduto categorias={categorias} onProdutoCriado={carregar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  erro: { color: '#b91c1c', marginBottom: 12 },
});
