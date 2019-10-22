<?php echo $this->Html->css('post'); ?>
<div class="posts">
    <?php foreach ($posts as $post): ?>
        <div class="post card card-sm">
            <div class="post-title">
                <?=$post['Post']['title']?>
            </div>
            <div class="post-body">
                <?=$post['Post']['body']?>
            </div>
            <?=$this->Html->link('Edit', ['action' => 'edit', $post['Post']['id']]) ?>
        </div>
    <?php endforeach ?>
</div>