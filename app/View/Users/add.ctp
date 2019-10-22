<div class="users form">
<?php echo $this->Form->create('User'); ?>
    <fieldset>
        <legend><?php echo __('Add User'); ?></legend>
        <?php
            echo $this->Form->input('first_name');
            echo $this->Form->input('last_name');
            echo $this->Form->input('email');
            echo $this->Form->input('birthdate');
            echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('sex', [
                'options' => ['M' => 'Male', 'F' => 'Female']
            ]);
        ?>
    </fieldset>
<?php echo $this->Form->end(__('Submit')); ?>
</div>