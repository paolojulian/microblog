<?php header('Cache-Control: public, max-age=31536000, no Etag'); ?>
<?php header('Cache-Control: max-age=2592000'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<?php echo $this->Html->charset(); ?>
	<meta http-equiv="Cache-control" content="public">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Microblog 2</title>
	<?php echo $this->Html->css('app.min') ?>
	<?php echo $this->Html->css('card') ?>
	<?php echo $this->Html->css('Form') ?>
	<?php echo $this->Html->css('scrollbar') ?>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/site.webmanifest">
	<link rel="stylesheet"
		crossorigin
		type="text/css"
		href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<div id="app"></div>
	<?= $this->Html->script('v-notifier'); ?>
	<script type="module" src="/js/bundle.min.js?2"></script>
</body>
</html>