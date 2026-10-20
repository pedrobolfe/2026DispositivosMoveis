import { StyleSheet, Text, View } from 'react-native';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
}

export function ListaProdutos({ produtos }: Props) {
  return (
    <View style={styles.tabela}>
      <View style={[styles.linha, styles.cabecalho]}>
        <Text style={[styles.celula, styles.celulaCabecalho]}>ID</Text>
        <Text style={[styles.celula, styles.celulaCabecalho, styles.nome]}>Nome</Text>
        <Text style={[styles.celula, styles.celulaCabecalho, styles.categoria]}>Categoria</Text>
        <Text style={[styles.celula, styles.celulaCabecalho]}>Preço</Text>
        <Text style={[styles.celula, styles.celulaCabecalho]}>Estoque</Text>
      </View>
      {produtos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
      ) : (
        produtos.map((produto) => (
          <View key={produto.id} style={styles.linha}>
            <Text style={styles.celula}>{produto.id}</Text>
            <Text style={[styles.celula, styles.nome]}>{produto.nome}</Text>
            <Text style={[styles.celula, styles.categoria]}>{produto.categoria.nome}</Text>
            <Text style={styles.celula}>
              {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <Text style={styles.celula}>{produto.quantidade}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabela: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  linha: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
    alignItems: 'center',
  },
  cabecalho: { backgroundColor: '#f5f5f5' },
  celula: { flex: 1, fontSize: 12 },
  nome: { flex: 2 },
  categoria: { flex: 1.5 },
  celulaCabecalho: { fontWeight: '600' },
  vazio: { padding: 12, color: '#666' },
});
