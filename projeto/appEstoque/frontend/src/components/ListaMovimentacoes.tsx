import { StyleSheet, Text, View } from 'react-native';
import { Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
}

export function ListaMovimentacoes({ movimentacoes }: Props) {
  return (
    <View style={styles.tabela}>
      <View style={[styles.linha, styles.cabecalho]}>
        <Text style={[styles.celula, styles.data, styles.celulaCabecalho]}>Data/Hora</Text>
        <Text style={[styles.celula, styles.produto, styles.celulaCabecalho]}>Produto</Text>
        <Text style={[styles.celula, styles.celulaCabecalho]}>Tipo</Text>
        <Text style={[styles.celula, styles.celulaCabecalho]}>Quantidade</Text>
      </View>
      {movimentacoes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma movimentação registrada.</Text>
      ) : (
        movimentacoes.map((movimentacao) => {
          const entrada = movimentacao.tipo === 'ENTRADA';
          return (
            <View key={movimentacao.id} style={styles.linha}>
              <Text style={[styles.celula, styles.data]}>
                {new Date(movimentacao.criadoEm).toLocaleString('pt-BR')}
              </Text>
              <Text style={[styles.celula, styles.produto]}>{movimentacao.produto.nome}</Text>
              <Text
                style={[
                  styles.celula,
                  styles.tipo,
                  entrada ? styles.entrada : styles.saida,
                ]}
              >
                {entrada ? 'Entrada' : 'Saída'}
              </Text>
              <Text style={styles.celula}>{movimentacao.quantidade}</Text>
            </View>
          );
        })
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
  data: { flex: 1.7 },
  produto: { flex: 1.4 },
  tipo: { fontWeight: '600' },
  entrada: { color: '#15803d' },
  saida: { color: '#b91c1c' },
  celulaCabecalho: { fontWeight: '600' },
  vazio: { padding: 12, color: '#666' },
});
