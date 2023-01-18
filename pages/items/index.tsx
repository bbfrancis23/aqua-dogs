import axios from 'axios';

export default function Items() {
  return <div>All Items</div>;
}
export async function getStaticProps() {
  let items;
  try {
    items = await axios.get('http://localhost:5000/api/items');
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      tags: {},
    },
  };
}
