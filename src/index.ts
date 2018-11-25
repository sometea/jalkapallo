import { app } from './server';
import { jalkapalloConfig } from './config';

app.listen(jalkapalloConfig.port, () => {
    console.log('Jalkapallo listening on port ' + jalkapalloConfig.port + '.');
});
