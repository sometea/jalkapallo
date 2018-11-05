import { app } from './server';

const port = 3001;

app.listen(port, () => {
    console.log('Jalkapallo listening on port ' + port + '.');
});
