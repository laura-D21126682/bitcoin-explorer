
const dns = require('dns');
const { promisify } = require('util');

// promises
const dnsResolve4 = promisify(dns.resolve4);

/**
 * The getIps function returns arroy of valid IP addresses on the BTC network
 *  - A DNS seed is taken as a parameter
 *  - dns.resolve4: resolves all IPv4 addresses of the given DNS Seed
 *  - @param {string} dns_seed - DNS Seed
 */
const getIps = async (dns_seed) => {

  try {
    const addresses = await dnsResolve4(dns_seed);
    console.log(`DNS Seed: ${dns_seed},\n IPV 4 Addresses: ${JSON.stringify(addresses)}`);
    return addresses;

  } catch (err) {
    console.error(`Error resolving DNS Seed: ${dns_seed}`);
  }

}; 

module.exports = getIps;





/**
 * Response -
 * DNS Seed: seed.bitcoin.sipa.be,
 * IPv4 Addresses: 
 *    ["144.76.34.220","109.199.104.221","34.106.249.67","37.60.229.120",
 *     "167.114.210.19","104.1.92.17","13.244.104.103","104.196.231.248",
 *     "193.181.35.38","62.31.155.218","13.49.72.71","35.200.254.144",
 *     "78.46.66.15","209.141.52.59","74.96.184.197","34.105.209.243",
 *     "217.15.161.228","85.10.155.77","37.60.227.127","62.169.18.115",
 *     "68.69.170.92","139.59.92.87","97.113.55.243","91.183.207.58","213.199.55.104"]
 */