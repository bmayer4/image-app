import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { sortByCategory } from '../../actions/filters';
import categories from '../../utilities/categories';

class PostFilters extends Component {

  onCategoryChange = (e) => {
    this.props.sortByCategory(e.target.value);
    this.props.getPosts(e.target.value, 0, this.props.limit);
  }

  render() {

    const { category } = this.props.filters;

    let selectOptions = categories.map(c => (
      <option key={c} value={c}>
          {c}
      </option>
  ));

    return (
      <div>
        <label><div className='catSort'>Sort by Category</div></label>
        <select className='form-control w-25' value={category} onChange={this.onCategoryChange}>
            {selectOptions}
        </select>
      </div>
    )
  }
}

PostFilters.propTypes = {
    sortByCategory: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    filters: state.filters
  })
  
  const mapDispatchToProps = (dispatch) => ({
    sortByCategory: (category) => dispatch(sortByCategory(category))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(PostFilters);

