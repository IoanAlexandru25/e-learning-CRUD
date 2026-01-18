<script setup></script>

<template>
  <v-footer color="secondary" app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <v-icon icon="mdi-copyright" size="small" class="mr-1"></v-icon>
          <span class="text-body-2">
            {{ new Date().getFullYear() }} E-Learning Platform. All rights reserved.
          </span>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn
            variant="text"
            size="small"
            icon="mdi-facebook"
            class="mx-1"
          ></v-btn>
          <v-btn
            variant="text"
            size="small"
            icon="mdi-twitter"
            class="mx-1"
          ></v-btn>
          <v-btn
            variant="text"
            size="small"
            icon="mdi-linkedin"
            class="mx-1"
          ></v-btn>
          <v-btn
            variant="text"
            size="small"
            icon="mdi-instagram"
            class="mx-1"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
