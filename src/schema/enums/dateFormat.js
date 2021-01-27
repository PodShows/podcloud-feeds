const DateFormat = () => [
  `
	enum DateFormat {
	  RFC822
	}
`
];

const DateFormatEnum = {
  RFC822: "ddd, DD MMM YYYY HH:mm:ss ZZ"
};

DateFormat.resolve = key => {
  return DateFormatEnum[key];
};

export default DateFormat;
