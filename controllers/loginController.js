export const loginController = (req, res) => {
	res.render('common', {
		pageTitle: 'Login',
		jsPath: '/build/bundle.login.js'
	});
}