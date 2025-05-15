import PageBreadcrumb from './components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import BrandsListingCard from './components/BrandsListingCard';
import OrdersChart from './components/OrdersChart';
import SellingProductsCard from './components/SellingProductsCard';
import Stat from './components/Stat';
import Statistics from './components/Statistics';
import TotalRevenue from './components/TotalRevenue';
import UserCard from './components/UserCard';
const superAdminpage = () => {
  return <>
      <PageBreadcrumb title='Dashboard' />
      {/* <Stat /> */}
      {/* <Row>
        <Col xxl={4} xl={6}>
          <OrdersChart />
        </Col>
        <Col xxl={4} xl={6}>
          <Statistics />
        </Col>
        <Col xxl={4} xl={12}>
          <TotalRevenue />
        </Col>
      </Row>
      <UserCard />
      <Row>
        <Col xxl={6}>
          <BrandsListingCard />
        </Col>
        <Col xxl={6}>
          <SellingProductsCard />
        </Col>
      </Row> */}
    </>;
};
export default superAdminpage;