import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';
import * as CartActions from '../../store/modules/cart/actions';
import { Container, ProductList, Loading } from './styles';

class Home extends Component {
  static propTypes = {
    amount: PropTypes.objectOf(PropTypes.number).isRequired,
    addToCartRequest: PropTypes.func.isRequired,
  };

  state = {
    products: [],
    loading: false,
  };

  async componentDidMount() {
    try {
      this.setState({ loading: true });

      const { data } = await api.get('products');

      const response = data.map((product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      this.setState({ products: response });
    } catch (err) {
      console.tron.error(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  handleAddProduct = (id) => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products, loading } = this.state;
    const { amount } = this.props;

    return (
      <Container loading={loading ? 1 : 0}>
        {loading ? (
          <Loading color="#FFF" size={120} />
        ) : (
          <ProductList>
            {products.map((product) => (
              <li key={product.id}>
                <img src={product.image} alt={product.title} />
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>

                <button
                  type="button"
                  onClick={() => this.handleAddProduct(product.id)}
                >
                  <div>
                    <MdAddShoppingCart size={16} color="#FFF" />
                    {amount[product.id] || 0}
                  </div>

                  <span>ADICIONAR AO CARRINHO</span>
                </button>
              </li>
            ))}
          </ProductList>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
