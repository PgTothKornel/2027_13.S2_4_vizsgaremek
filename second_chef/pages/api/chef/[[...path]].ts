import chefApi from '@/app/lib/chef-api';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default chefApi;
