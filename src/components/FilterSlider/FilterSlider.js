import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const marks = [
  {
    value: 0,
    label: '0 flight',
  },
  {
    value: 50,
    label: '50 flights',
  },
];

function valuetext(value) {
  return `${value}`;
}

export default function FilterSlider({ limit, onChange, onChangeCommited }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-always" gutterBottom>
        Flights to show
      </Typography>
      <Slider
        value={typeof limit === 'number' ? limit : 0}
        onChange={onChange}
        onChangeCommitted={onChangeCommited}
        min={1}
        max={50}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-always"
        step={1}
        marks={marks}
        valueLabelDisplay="on"
      />
    </div>
  );
}